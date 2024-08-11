import { NextPage } from "next";
import {
  ActionIcon,
  AspectRatio,
  Group,
  Image,
  Table,
  Text,
} from "@mantine/core";
import { IconEdit, IconTrash, IconVideo } from "@tabler/icons-react";
import useSWR from "swr";
import { useToggle } from "@mantine/hooks";
import DataTable from "@/components/common/dataTable";
import AppShellComponent from "@/components/layout/appshell";

const Facilities: NextPage = () => {
  const [value, toggle] = useToggle([false, true]);

  const { data } = useSWR<any[]>("/api/v1/facilities");

  const rows =
    data &&
    data.map((item) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Group wrap="nowrap" justify="start" gap={12}>
            <AspectRatio
              className="border border-red-500"
              ratio={55 / 40}
              maw={50}
              my={4}
            >
              <Image src={item.image} />
            </AspectRatio>
            <Text truncate="end" size="sm">
              {item.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text truncate="end" size="sm">
            {item.description}
          </Text>
        </Table.Td>
        <Table.Td>
          <Group wrap="nowrap">
            <ActionIcon variant="transparent">
              <IconVideo color="red" stroke={2} />
            </ActionIcon>
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
    <AppShellComponent title="Facilities" aside={value ? <div></div> : null}>
      <DataTable
        searchPlaceholder="Search facilities"
        btnTitle="Add facility"
        onClick={() => toggle()}
        head={["Facility", "Description", "Actions"]}
        rows={rows}
        currentPage={1}
        onPageChange={() => {}}
        totalPages={1}
      />
    </AppShellComponent>
  );
};

export default Facilities;
