import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppShell, NavLink, ScrollArea, Stack, Text } from "@mantine/core";
import {
  IconBuilding,
  IconBuildingBroadcastTower,
  IconBuildingCommunity,
  IconDeviceTvOld,
  IconLayoutDashboard,
  IconSettings,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import classes from "@/components/common/Button.module.css";
import Link from "next/link";

const data = [
  { link: "/", label: "Dashboard", icon: IconLayoutDashboard },
  { link: "/facilities", label: "Facilities", icon: IconBuildingCommunity },
  {
    link: "/structures",
    label: "Structures",
    icon: IconBuilding,
    drop: [
      { link: "/structures/blocks", label: "Blocks" },
      { link: "/structures/floors", label: "Floors" },
      { link: "/structures", label: "Rooms" },
    ],
  },
  {
    link: "/channels",
    label: "Channels",
    icon: IconBuildingBroadcastTower,
    drop: [
      { link: "/channels", label: "List" },
      { link: "/channels/cat", label: "Categories" },
    ],
  },
  {
    link: "/tvs",
    label: "Tvs",
    icon: IconDeviceTvOld,
    drop: [
      { link: "/tvs", label: "Lists" },
      { link: "/tvs/brands", label: "Brands" },
    ],
  },
  {
    link: "/restaurant",
    label: "Restaurant",
    icon: IconToolsKitchen2,
    drop: [
      { link: "/restaurant/orders", label: "Orders" },
      { link: "/restaurant/meals", label: "Meals" },
      { link: "/restaurant/menu", label: "Menus" },
      { link: "/restaurant/submenu", label: "Sub Menus" },
    ],
  },
  {
    link: "/settings",
    label: "Settings",
    icon: IconSettings,
  },
];

const SideNavComponent = () => {
  const { pathname } = useRouter();
  const [openedLinks, setOpenedLinks] = useState<string | null>(null);

  useEffect(() => {
    const currentParentLabel = data.find(
      (item) =>
        pathname.startsWith(item.link) ||
        (item.drop &&
          item.drop.some((child) => pathname.startsWith(child.link))),
    )?.label;

    if (currentParentLabel && currentParentLabel !== openedLinks) {
      setOpenedLinks(currentParentLabel);
    }
  }, [pathname]);

  const toggleOpened = (label: string) => {
    if (openedLinks !== label) {
      setOpenedLinks(label);
    }
  };

  const links = data.map((item) => (
    <NavLink
      component={Link}
      key={item.label}
      className={classes.link}
      active={pathname === item.link}
      leftSection={<item.icon />}
      label={item.label}
      href={item.link}
      opened={openedLinks === item.label}
      onClick={() => toggleOpened(item.label)}
    >
      {item.drop &&
        item.drop.map((drop) => (
          <NavLink
            component={Link}
            key={drop.label}
            active={pathname === drop.link}
            className={classes.nested}
            label={drop.label}
            href={drop.link}
            // onClick={() => toggleOpened(item.label)}
          />
        ))}
    </NavLink>
  ));

  return (
    <AppShell.Navbar>
      <nav className="mt-2 ml-2">
        <Stack
          justify="space-between"
          className="h-screen py-4 px-2 rounded-xl border bg-[#103691]"
        >
          <div className="border-b h-[50px] pl-3">
            <Text c="white">SERENA HOTEL</Text>
          </div>
          <ScrollArea className="h-screen">{links}</ScrollArea>
          <div className="border-t h-[50px]"></div>
        </Stack>
      </nav>
    </AppShell.Navbar>
  );
};

export default SideNavComponent;
