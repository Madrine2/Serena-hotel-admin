import { Modal, Group, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import React from "react";

type DoneDialogProps = {
    opened: boolean;
    onClose: () => void;
};

const DoneDialog: React.FC<DoneDialogProps> = ({ opened, onClose }) => {
    return (
        <Modal opened={opened} onClose={onClose} withCloseButton={false} centered>
            <Group position="center" align="center" spacing="xs">
                <Text size="lg" color="blue" weight={500}>
                    Done
                </Text>
                <IconCheck size={24} color="red" />
            </Group>
        </Modal>
    );
};

export default DoneDialog;
