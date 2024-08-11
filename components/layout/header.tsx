import {
  AppShell,
  Avatar,
  Group,
  Menu,
  rem,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconMinus,
  IconSettings,
} from "@tabler/icons-react";
import React, { forwardRef } from "react";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}
const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        padding: "var(--mantine-spacing-md)",
        color: "var(--mantine-color-text)",
        borderRadius: "var(--mantine-radius-sm)",
      }}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <IconChevronDown size="1rem" />}
      </Group>
    </UnstyledButton>
  ),
);

interface headerProps {
  image: string;
  userName: string;
  email: string;
  pageName: string;
}

const HeaderComponent = ({ image, userName, email, pageName }: headerProps) => {
  return (
    <AppShell.Header>
      <Group justify="space-between" align="center">
        <Group gap={5}>
          <IconMinus stroke={1} />
          <Text size="md">{pageName}</Text>
        </Group>
        <Menu position="bottom-start" withArrow arrowPosition="center">
          <Menu.Target>
            <UserButton image={image} name={userName} email={email} />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Settings
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconLogout style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </AppShell.Header>
  );
};

export default HeaderComponent;
