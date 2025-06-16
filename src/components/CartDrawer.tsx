'use client';

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  useDisclosure,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import { CDN_BASE_URL, FALLBACK_IMAGE } from '@/lib/config';

export default function CartDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <>
      <Box position="relative">
        <IconButton
          aria-label="Shopping cart"
          icon={<FiShoppingCart />}
          onClick={onOpen}
          variant="ghost"
          size="lg"
        />
        {itemCount > 0 && (
          <Badge
            position="absolute"
            top="-2px"
            right="-2px"
            colorScheme="red"
            borderRadius="full"
            fontSize="xs"
            minW="20px"
            h="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {itemCount}
          </Badge>
        )}
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Keranjang Belanja</DrawerHeader>

          <DrawerBody>
            {items.length === 0 ? (
              <Flex h="full" alignItems="center" justifyContent="center">
                <Text color="gray.500">Keranjang kosong</Text>
              </Flex>
            ) : (
              <VStack spacing={4} align="stretch">
                {items.map((item) => {
                  const imageUrl = item.images?.image_path
                    ? `${CDN_BASE_URL}/${item.images.image_path}`
                    : FALLBACK_IMAGE;

                  return (
                    <Box key={item.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <HStack spacing={3}>
                        <Image
                          src={imageUrl}
                          alt={item.product_name}
                          boxSize="60px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        <VStack flex={1} align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="semibold" noOfLines={2}>
                            {item.product_name}
                          </Text>
                          <Text fontSize="sm" color="blue.600" fontWeight="bold">
                            Rp {item.selling_price.toLocaleString('id-ID')}
                          </Text>
                        </VStack>
                        <VStack spacing={2}>
                          <HStack>
                            <IconButton
                              aria-label="Decrease quantity"
                              icon={<FiMinus />}
                              size="xs"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              isDisabled={item.quantity <= 1}
                            />
                            <Text minW="30px" textAlign="center">
                              {item.quantity}
                            </Text>
                            <IconButton
                              aria-label="Increase quantity"
                              icon={<FiPlus />}
                              size="xs"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            />
                          </HStack>
                          <IconButton
                            aria-label="Remove item"
                            icon={<FiTrash2 />}
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                          />
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </DrawerBody>

          {items.length > 0 && (
            <DrawerFooter flexDirection="column">
              <Divider mb={4} />
              <HStack justify="space-between" w="full" mb={4}>
                <Text fontSize="lg" fontWeight="bold">
                  Total:
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  Rp {total.toLocaleString('id-ID')}
                </Text>
              </HStack>
              <VStack w="full" spacing={2}>
                <Button colorScheme="blue" size="lg" w="full">
                  Checkout
                </Button>
                <Button variant="outline" size="sm" w="full" onClick={clearCart}>
                  Kosongkan Keranjang
                </Button>
              </VStack>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
