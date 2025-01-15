import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  tokenName: string;
  recipientAddress: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  tokenName,
  recipientAddress,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Withdrawal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Please confirm that you want to withdraw{' '}
            <strong>
              {amount} {tokenName}
            </strong>
          </Text>
          <Text>
            The tokens will be sent on their native chain to: {' '}
            <strong>{recipientAddress}</strong>
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={onConfirm}>
            Sign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;