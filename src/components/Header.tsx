'use client';

import { Box, Container, Flex, Image, Text, HStack } from '@chakra-ui/react';
import Navigation from './Navigation';
import CartDrawer from './CartDrawer';
import Link from 'next/link';

export default function Header() {
  return (
    <Box as="header" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <Flex py={4} alignItems="center" justifyContent="space-between">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Flex alignItems="center">
              <Image src="/img/logo.png" alt="Sandy Logo" height="40px" />
              <Text ml={3} fontSize="xl" fontWeight="bold" color="gray.800">
              </Text>
            </Flex>
          </Link>
          <HStack spacing={4}>
            <Navigation />
            <CartDrawer />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
