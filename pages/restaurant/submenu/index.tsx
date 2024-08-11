import { NextPage } from "next";
import AppShellComponent from "@/components/layout/appshell";
import DataTable from "@/components/common/dataTable";
import useSWR from "swr";
import { ActionIcon, Group, Image, Table, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
const head = ["Name", "Image", "Start Time", "End Time", "Actions"];

interface MenuDetails {
  startTime: string;
  endTime: string;
  description: string;
}

interface Menu {
  _id: string;
  name: string;
  image: string;
  active: boolean;
  details: MenuDetails;
  createdAt: Date;
}

interface SubData {
  name: string;
  data: string[];
}

interface SubMenu {
  _id: string;
  count: number;
  menu: Menu[];
  data: SubData;
}

const RestSubMenu: NextPage = () => {
  const { data } = useSWR<SubMenu[]>("/api/v1/meals/sub_menu");
  const rows =
    data &&
    data.map((item) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          {item.menu.map((mn) => (
            <Text>{mn.name}</Text>
          ))}
        </Table.Td>
        <Table.Td>
          {item.menu.map((mn) => (
            <Image src={mn.image} w={80} h={80} />
          ))}
        </Table.Td>
        <Table.Td>
          {item.menu.map((mn) => (
            <Text>{mn.details.startTime}</Text>
          ))}
        </Table.Td>
        <Table.Td>
          {item.menu.map((mn) => (
            <Text>{mn.details.endTime}</Text>
          ))}
        </Table.Td>
        <Table.Td>
          <Group wrap="nowrap">
            <ActionIcon variant="transparent">
              <IconEdit color="#3F56AC" stroke={2} />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <IconTrash color="red" stroke={2} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <AppShellComponent title="Sub menu">
      <DataTable
        head={head}
        btnTitle={"Add Sub-Menu"}
        searchPlaceholder={"Search Sub-Menu"}
        rows={rows}
        onClick={() => {}}
        currentPage={1}
        onPageChange={() => {}}
        totalPages={1}
      />
    </AppShellComponent>
  );
};

export default RestSubMenu;
