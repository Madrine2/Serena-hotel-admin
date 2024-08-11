import { NavLink } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

import React from "react";

const NavLinkComponent = () => {
  return <NavLink rightSection={<IconChevronRight stroke={1} />} />;
};

export default NavLinkComponent;
