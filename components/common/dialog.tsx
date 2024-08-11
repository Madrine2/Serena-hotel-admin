import React from "react";
import {ActionIcon, Button, Stack, Text, Modal, useMantineTheme, Group, Title, Dialog} from "@mantine/core";
import { IconX } from "@tabler/icons-react";

type DeleteDialogProps = {
    deleteItem: string;
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteDialog: React.FC<DeleteDialogProps> = ({ deleteItem, opened, onClose, onConfirm }) => {
    const theme = useMantineTheme();
    const displayText = deleteItem && deleteItem.trim() ? deleteItem.toUpperCase() : 'ITEM';

    return (

        <Modal
            w={300}
            opened={opened}
            onClose={onClose}
            title={
            <Group position="apart">
                <Title size="md" weight={500}>{`DELETE ${displayText}`}</Title>
                <ActionIcon onClick={onClose}>
                    <IconX size={16} />
                </ActionIcon>
            </Group>
            }
            centered
            withCloseButton={false}
        >
            <Stack spacing="sm">
                <Group position="apart">
                    <Text size="sm">Are you sure you want to delete this item?</Text>
                </Group>
                <Group position="right">
                    <Button variant="outline" color={theme.colors.blue[6]} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={onConfirm}>
                        Delete
                    </Button>
                </Group>
            </Stack>
        </Modal>

    );
};

export default DeleteDialog;
