import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useEffect, useState } from 'react';

interface SvgImageProps {
  uri: string;
  width?: number;
  height?: number;
}

export default function SvgImage({ uri, width = 100, height = 100 }: SvgImageProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(uri);
        const text = await response.text();
        setSvgContent(text);
      } catch (err) {
        console.error('Erreur lors du chargement du SVG :', err);
        setSvgContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSvg();
  }, [uri]);

  if (loading) return <ActivityIndicator size="small" color="#555" />;
  if (!svgContent) return <View style={{ width, height }} />;

  return <SvgXml xml={svgContent} width={width} height={height} />;
}