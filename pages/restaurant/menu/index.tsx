import { NextPage } from "next";
import AppShellComponent from "@/components/layout/appshell";
import useSWR from "swr";
import { ActionIcon, Group, Table, Text, Image } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import DataTable from "@/components/common/dataTable";
import React from "react";

const head = ["Name", "Image", "Details", "Actions"];

const RestMenu: NextPage = () => {
  const { data } = useSWR<any[]>("/api/v1/meals/menu");
  const rows =
    data &&
    data.map((item) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Text>{item.name}</Text>
        </Table.Td>
        <Table.Td>
          <Image src={item.image} h={50} w={50} />
        </Table.Td>
        <Table.Td>
          <Text>{item.details["startTime"]}</Text>
          <Text>{item.details["endTime"]}</Text>
          <Text>{item.details["description"]}</Text>
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
    <AppShellComponent title="Main menu">
      <DataTable
        head={head}
        rows={rows}
        searchPlaceholder={"Search menu"}
        btnTitle={"Add Menu"}
        onClick={() => {}}
        currentPage={1}
        onPageChange={() => {}}
        totalPages={1}
      />
    </AppShellComponent>
  );
};

export default RestMenu;
