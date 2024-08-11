import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Input,
  Pagination,
  Paper,
  Space,
  Table,
  Text,
} from "@mantine/core";
import React, { ReactNode } from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";

type DataTableProps = {
  head: string[];
  btnTitle: string;
  searchPlaceholder: string;
  rows: ReactNode;
  onClick: React.MouseEventHandler;
  currentPage: number; // Current page number
  totalPages: number; // Total number of pages
  onPageChange: (page: number) => void; // Function to handle page change
};

const DataTable: React.FC<DataTableProps> = ({
  head,
  rows,
  onClick,
  btnTitle,
  searchPlaceholder,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const headData = head.map((item) => (
    <Table.Th key={item}>
      <Center inline h={50}>
        <Text>{item}</Text>
      </Center>
    </Table.Th>
  ));

  return (
    <Container mih={700} h={700}>
      <Group justify="space-between">
        <Input
          placeholder={searchPlaceholder}
          size="xs"
          max={400}
          leftSection={<IconSearch stroke={1} size={16} />}
        />
        <Button onClick={onClick} variant="filled" rightSection={<IconPlus />}>
          {btnTitle}
        </Button>
      </Group>
      <Space h="md" />

      <Paper>
        <Table.ScrollContainer minWidth={500}>
          <Table
            verticalSpacing={0}
            stickyHeader
            striped
            withColumnBorders
            withTableBorder
            highlightOnHover
          >
            <Table.Caption>Facilities</Table.Caption>
            <Table.Thead>
              <Table.Tr>{headData}</Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
      <Space h="md" />

      <Pagination
        total={totalPages}
        value={currentPage}
        onChange={onPageChange}
      />
    </Container>
  );
};

export default DataTable;
