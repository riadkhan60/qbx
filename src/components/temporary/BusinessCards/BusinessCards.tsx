'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './swiperStyles.css';
import Image from 'next/image';

interface Card {
  id: string;
  title: string;
  image: string;
  uniqueId?: string;
}

interface CardSwiperProps {
  cards?: Card[];
  enableLoop?: boolean; // Added prop to control loop behavior
}

export default function CardSwiper({
  cards = [
    {
      id: '1',
      title: 'Card 1',
      image:
        'https://images.unsplash.com/vector-1739945219200-b8c476653f05?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '2',
      title: 'Card 2',
      image:
        'https://images.unsplash.com/vector-1740729341472-2bcbf6d5b99b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '3',
      title: 'Card 3',
      image:
        'https://images.unsplash.com/vector-1742114595098-94bff0dea3cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '4',
      title: 'Card 4',
      image:
        'https://images.unsplash.com/vector-1743529921186-e8a5ae51d845?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ],
  enableLoop = false, // Default to disabled for better performance
}: CardSwiperProps): React.ReactElement | null {
  // State to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const processedCards = React.useMemo(() => {
    if (cards.length === 0) return [];

    const uniqueCards = cards.map((card, index) => ({
      ...card,
      uniqueId: `${card.id}-${index}`,
    }));

    // Only add duplicate cards if loop is enabled
    if (enableLoop) {
      if (uniqueCards.length === 1) {
        return [
          ...uniqueCards,
          { ...uniqueCards[0], uniqueId: `${uniqueCards[0].id}-clone-1` },
          { ...uniqueCards[0], uniqueId: `${uniqueCards[0].id}-clone-2` },
        ];
      }

      if (uniqueCards.length === 2) {
        return [
          ...uniqueCards,
          { ...uniqueCards[0], uniqueId: `${uniqueCards[0].id}-clone-1` },
        ];
      }
    }

    return uniqueCards;
  }, [cards, enableLoop]);

  if (processedCards.length === 0 || !isMounted) return null;

  // Determine if loop should be enabled based on card count and enableLoop prop
  const shouldEnableLoop = enableLoop && processedCards.length >= 3;

  return (
    <div className="swiper-container">
      <Swiper
        effect={'coverflow'}
        speed={800}
        loop={shouldEnableLoop}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={shouldEnableLoop ? 1 : 2} // Start at first real card if looping
        coverflowEffect={{
          rotate: 15,
          stretch: -50,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            coverflowEffect: {
              rotate: 10,
              stretch: -20,
              depth: 100,
            },
          },
          640: {
            slidesPerView: 1.5,
            coverflowEffect: {
              rotate: 15,
              stretch: -30,
              depth: 150,
            },
          },
          1024: {
            slidesPerView: 2.5,
            coverflowEffect: {
              rotate: 15,
              stretch: -50,
              depth: 200,
            },
          },
        }}
      >
        {processedCards.map((card) => (
          <SwiperSlide key={card.uniqueId} className="card-slide">
            <div className="card">
              <Image
                src={card.image}
                alt={card.title}
                loading="lazy"
                width={300}
                height={200}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <h3>{card.title}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
