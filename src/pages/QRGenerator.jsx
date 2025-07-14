
import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { QrCode, Download, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import QRCodeLib from 'qrcode';

const QRGenerator = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const menuUrl = window.location.origin;

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrDataUrl = await QRCodeLib.toDataURL(menuUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#667eea',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      toast({
        title: "Error!",
        description: "Gagal membuat QR Code",
        variant: "destructive"
      });
    }
    setIsGenerating(false);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = 'menu-qr-code.png';
    link.href = qrCodeUrl;
    link.click();

    toast({
      title: "QR Code berhasil diunduh!",
      description: "File telah disimpan ke perangkat Anda",
    });
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Menu Digital Kedai Makanan',
          text: 'Scan QR code ini untuk melihat menu digital kami!',
          url: menuUrl
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(menuUrl);
      toast({
        title: "Link berhasil disalin!",
        description: "Link menu telah disalin ke clipboard",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>QR Code Generator - Menu Digital</title>
        <meta name="description" content="Generate QR code untuk akses mudah ke menu digital kedai makanan" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <Link to="/">
              <Button variant="outline" className="mb-4 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Menu
              </Button>
            </Link>
            <h1 className="text-3xl font-bold gradient-text mb-2">QR Code Generator</h1>
            <p className="text-gray-600">Buat QR code untuk akses mudah ke menu digital</p>
          </motion.div>

          {/* QR Code Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="qr-container text-center mb-8"
          >
            <div className="mb-6">
              <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">QR Code Menu Digital</h2>
              <p className="text-gray-600 text-sm">
                Pelanggan dapat memindai QR code ini untuk mengakses menu
              </p>
            </div>

            {isGenerating ? (
              <div className="flex justify-center items-center h-64">
                <div className="loading-spinner w-8 h-8"></div>
              </div>
            ) : (
              <div className="flex justify-center mb-6">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code Menu Digital"
                  className="border-4 border-white shadow-lg rounded-lg"
                />
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={downloadQRCode}
                disabled={!qrCodeUrl}
                className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Download className="w-4 h-4" />
                Unduh QR Code
              </Button>

              <Button 
                onClick={shareQRCode}
                variant="outline"
                className="w-full gap-2"
              >
                <Share2 className="w-4 h-4" />
                Bagikan Link Menu
              </Button>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="admin-card rounded-xl p-6"
          >
            <h3 className="text-lg font-bold mb-4">Cara Menggunakan QR Code</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p>Unduh QR code dengan menekan tombol "Unduh QR Code"</p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p>Cetak QR code dan tempelkan di meja atau area yang mudah terlihat pelanggan</p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p>Pelanggan dapat memindai QR code menggunakan kamera smartphone mereka</p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <p>Pelanggan akan langsung diarahkan ke menu digital dan dapat memesan via WhatsApp</p>
              </div>
            </div>
          </motion.div>

          {/* URL Display */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="admin-card rounded-xl p-6 mt-6"
          >
            <h3 className="text-lg font-bold mb-3">Link Menu Digital</h3>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <code className="text-sm text-gray-700 break-all">{menuUrl}</code>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Link ini akan membuka menu digital langsung di browser
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default QRGenerator;
