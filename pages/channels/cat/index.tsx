import { NextPage } from "next";
import AppShellComponent from "@/components/layout/appshell";
import { useToggle } from "@mantine/hooks";
import useSWR from "swr";
import { ActionIcon, Group, Table, Text, Title } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import DataTable from "@/components/common/dataTable";

const head = ["Name", "Actions"];

const ChannelsCat: NextPage = () => {
  const [value, toggle] = useToggle([false, true]);
  const { data } = useSWR<any[]>("/api/v1/channels/cat");
  const rows =
    data &&
    data.map((item) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Text size="sm">{item.type}</Text>
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
    <AppShellComponent
      title="Channels"
      aside={value ? <Title>Add Categories</Title> : null}
    >
      <DataTable
        head={head}
        btnTitle={"Add Category"}
        searchPlaceholder="Search channels"
        rows={rows}
        onClick={() => toggle()}
        currentPage={1}
        onPageChange={() => {}}
        totalPages={1}
      />
    </AppShellComponent>
  );
};

export default ChannelsCat;
