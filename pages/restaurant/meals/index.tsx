import { NextPage } from "next";
import AppShellComponent from "@/components/layout/appshell";
import useSWR from "swr";
import { ActionIcon, Group, Image, Table, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import DataTable from "@/components/common/dataTable";
const head = ["Meal", "Images", "Actions"];

const RestMeals: NextPage = () => {
  const { data } = useSWR<any[]>("/api/v1/meals");
  const rows =
    data &&
    data.map((item) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Text>{item.name}</Text>
        </Table.Td>
        <Table.Td>
          <Image src={item.image} w={80} h={80} />
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
    <AppShellComponent title="Meals">
      <DataTable
        head={head}
        btnTitle={"Add Meal"}
        searchPlaceholder={"Search Meal"}
        rows={rows}
        onClick={() => {}}
        currentPage={1}
        onPageChange={() => {}}
        totalPages={1}
      />
    </AppShellComponent>
  );
};

export default RestMeals;
