'use client';

import { Box, Image, Text, Button, VStack, Container } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Dummy slider data - can be replaced with API data later
const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=600&fit=crop',
    title: 'Smartphone Terbaru 2025',
    subtitle: 'Dapatkan teknologi terdepan dengan harga terbaik',
    buttonText: 'Lihat Koleksi',
    buttonLink: '/category/1'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop',
    title: 'Gadget Premium',
    subtitle: 'Kualitas terbaik untuk gaya hidup modern Anda',
    buttonText: 'Jelajahi Sekarang',
    buttonLink: '/category/1'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=600&fit=crop',
    title: 'Promo Spesial',
    subtitle: 'Diskon hingga 50% untuk produk pilihan',
    buttonText: 'Dapatkan Promo',
    buttonLink: '/'
  }
];

export default function HeroSlider() {
  return (
    <Box
      position="relative"
      w="full"
      h={{ base: '300px', md: '400px', lg: '500px' }}
      overflow="hidden"
      sx={{
        '.swiper': {
          width: '100%',
          height: '100%',
        },
        '.swiper-button-next, .swiper-button-prev': {
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          '&:after': {
            fontSize: '20px',
            fontWeight: 'bold',
          },
        },
        '.swiper-pagination-bullet': {
          backgroundColor: 'white',
          opacity: 0.5,
        },
        '.swiper-pagination-bullet-active': {
          backgroundColor: 'white',
          opacity: 1,
        },
      }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Box
              position="relative"
              w="full"
              h="full"
              bgImage={`url(${slide.image})`}
              bgSize="cover"
              bgPosition="center"
              bgRepeat="no-repeat"
            >
              {/* Overlay */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.400"
                zIndex={1}
              />
              
              {/* Content */}
              <Container
                maxW="container.xl"
                h="full"
                display="flex"
                alignItems="center"
                position="relative"
                zIndex={2}
              >
                <VStack
                  align="start"
                  spacing={4}
                  maxW="500px"
                  color="white"
                >
                  <Text
                    fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}
                    fontWeight="bold"
                    lineHeight="shorter"
                    textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                  >
                    {slide.title}
                  </Text>
                  <Text
                    fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                    textShadow="1px 1px 2px rgba(0,0,0,0.5)"
                  >
                    {slide.subtitle}
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    fontSize="lg"
                    px={8}
                    py={6}
                    h="auto"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    {slide.buttonText}
                  </Button>
                </VStack>
              </Container>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
