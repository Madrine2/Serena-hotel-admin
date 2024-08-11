import { NextPage } from "next";
import AppShellComponent from "@/components/layout/appshell";
import DataTable from "@/components/common/dataTable";
import useSWR from "swr";
import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface Floor {
  id: string;
  name: string;
  totalRooms: number;
  block: string;
  createdAt: string;
}
interface Room {
  _id: string;
  number: string;
  floor: Floor[];
  type: string;
  createdAt: string;
}
const head = ["Room Number", "Floor", "Block", "Room Type", "Action"];
const StructureRooms: NextPage = () => {
  const { data } = useSWR<Room[]>("/api/v1/structures/rooms");
  const rows =
    data &&
    data.map((item) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Text>{item.number}</Text>
        </Table.Td>
        <Table.Td>
          {item.floor.map((d) => (
            <Text>{d.name}</Text>
          ))}
        </Table.Td>
        <Table.Td>
          {item.floor.map((d) => (
            <Text>{d.block}</Text>
          ))}
        </Table.Td>
        <Table.Td>
          <Text>{item.type}</Text>
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
    <AppShellComponent title="Rooms">
      <DataTable
        head={head}
        btnTitle={"Add Rooms"}
        searchPlaceholder={"Search Room"}
        rows={rows}
        onClick={() => {}}
        currentPage={1}
        onPageChange={() => {}}
        totalPages={1}
      />
    </AppShellComponent>
  );
};

export default StructureRooms;
