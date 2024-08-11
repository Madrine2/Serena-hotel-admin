import { AppShell } from "@mantine/core";
import HeaderComponent from "@/components/layout/header";
import SideNavComponent from "@/components/layout/sideNav";
import React, { ReactNode } from "react";

type AppShellProps = {
  title?: string;
  children?: ReactNode;
  aside?: React.ReactNode;
};

const AppShellComponent: React.FC<AppShellProps> = ({
  title = "No title set",
  children,
  aside,
}) => {
  return (
    <AppShell
      navbar={{ width: 250, breakpoint: "sm" }}
      header={{ height: 70 }}
      aside={{ width: aside ? 350 : 0, breakpoint: "xs" }}
      layout="alt"
      padding="xl"
      transitionDuration={100}
      withBorder={true}
      styles={{
        header: {
          backgroundColor: "#ececec",
        },
        aside: {
          backgroundColor: "#ececec",
        },
        main: {
          backgroundColor: "#ececec",
        },
        navbar: {
          backgroundColor: "#ececec",
        },
      }}
    >
      <HeaderComponent
        userName="Namulindwa Madrine"
        email="mwesigwadi@gmail.com"
        image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
        pageName={title}
      />
      <SideNavComponent />
      <AppShell.Main>{children}</AppShell.Main>
      {aside && <AppShell.Aside>{aside}</AppShell.Aside>}
    </AppShell>
  );
};
export default AppShellComponent;
