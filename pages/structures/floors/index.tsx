import { NextPage } from "next";
import AppShellComponent from "@/components/layout/appshell";
import DataTable from "@/components/common/dataTable";
import useSWR from "swr";
import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
interface Block {
  _id: string;
  name: string;
  totalRooms: number;
  totalFloors: number;
  createdAt: string;
}
interface Floors {
  _id: string;
  name: string;
  totalRooms: number;
  block: Block[];
  createdAt: string;
}

const head = ["Name", "Total Rooms", "Floor"];
const StructureFloors: NextPage = () => {
  const { data } = useSWR<Floors[]>("/api/v1/structures/floors");
  const rows =
    data &&
    data.map((item) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Text>{item.name}</Text>
        </Table.Td>
        <Table.Td>
          <Text>{item.totalRooms}</Text>
        </Table.Td>
        <Table.Td>
          {item.block.map((db) => (
            <Text>{db.name}</Text>
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
    <AppShellComponent title="Floors">
      <DataTable
        head={head}
        btnTitle={"Add Floor"}
        searchPlaceholder={"Search floor"}
        rows={rows}
        onClick={() => {}}
        currentPage={1}
        onPageChange={() => {}}
        totalPages={1}
      />
    </AppShellComponent>
  );
};

export default StructureFloors;
