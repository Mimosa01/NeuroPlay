import { useState, useEffect, useRef } from 'react';
import type { ModulationCloudDTO } from '../../network/dto/modulationCloud.dto';
import { TRANSMITTER_STYLES } from '../../../shared/constants/transmitter.constants';

export const useCloudController = (cloud: ModulationCloudDTO) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayRadius, setDisplayRadius] = useState(cloud.raius);
  const cloudRef = useRef<SVGGElement>(null);

  // Адаптивный радиус при наведении
  useEffect(() => {
    setDisplayRadius(cloud.raius * (isHovered ? 1.1 : 1));
  }, [isHovered, cloud.raius]);

  const style = TRANSMITTER_STYLES[cloud.type as keyof typeof TRANSMITTER_STYLES] || TRANSMITTER_STYLES.dopamine;

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  const state = {
    isHovered,
    displayRadius,
  };

  return {
    handlers,
    state,
    style,
    cloudRef,
  };
};