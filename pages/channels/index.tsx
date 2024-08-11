import React, { ReactNode, useState } from "react";
import { NextPage } from "next";
import axios from "axios";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  CloseButton,
  Container,
  Flex,
  Group,
  Image,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit, IconLink, IconTrash, IconUpload } from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import { useDisclosure, useToggle } from "@mantine/hooks";
import AppShellComponent from "@/components/layout/appshell";
import DataTable from "@/components/common/dataTable";

import Dialog from "@/components/common/dialog";
import DoneDialog from "@/components/common/doneDialog";


const head = ["Name", "Categories", "Actions"];

interface catData {
  _id: string;
  count: number;
  type: string;
  image: string;
}

interface Channel {
  _id: string;
  count: number;
  name: string;
  logo: string;
  status: boolean;
  country: string;
}

interface ChannelProps {
  name: string;
  logo: string;
  input: string;
  status?: boolean;
  country: string;
  category?: string[];
}

interface ChannelResponse {
  channels: Channel[];
  total: number;
}

const Channels: NextPage = () => {
  const [value, toggle] = useToggle([true, false]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
  const [showDoneDialog, setShowDoneDialog] = useState(false); // State to control DoneDialog visibility

  const [countries, setCountries] = useState<string[]>([
    "UG",
    "ZA",
    "SPN",
    "USA",
    "KE",
  ]);
  const [countryDropDownOpen, { toggle: closeCountryDrop }] = useDisclosure();
  const [catDropDownOpen, { toggle: closeCatDrop }] = useDisclosure();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [input, setInput] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState([""]);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const addChannel = async ({
                              name,
                              logo,
                              input,
                              country,
                              category,
                            }: ChannelProps) => {
    const res = await axios.post(`/api/v1/channels/add`, {
      name,
      logo,
      input,
      status: true,
      country,
      pg: [{}],
      category,
    });
    setIsLoading(false);
    return res.data;
  };

  const addCategory = (newCategory: string) => {
    setCategory((prevCategories) => {
      if (newCategory.trim() !== "" && !prevCategories.includes(newCategory)) {
        return [...prevCategories, newCategory].filter((c) => c.trim() !== "");
      }
      return prevCategories.filter((c) => c.trim() !== "");
    });
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategory((prevCategories) =>
        prevCategories.filter((cat) => cat !== categoryToRemove)
    );
  };

  const deleteChannel = async () => {
    if (channelToDelete) {
      const res = await axios.delete(`/api/v1/channels/delete?id=${channelToDelete._id}`);
      console.log(res.data);
      setDeleteDialogOpened(false);
      setChannelToDelete(null);
      setShowDoneDialog(true); // Show the "Done" dialog after deletion
      setTimeout(() => {
        setShowDoneDialog(false); // Hide the "Done" dialog after 2 seconds
      }, 2000);
    }
  };

  const PAGE_LIMIT = 8;
  const { data, size, setSize, isValidating } = useSWRInfinite<ChannelResponse>(
      (pageIndex) =>
          `/api/v1/channels?index=${pageIndex * PAGE_LIMIT}&limit=${PAGE_LIMIT}`
  );

  const { data: data2 } = useSWR<catData[]>(
      data ? "/api/v1/channels/cat/" : null
  );

  const data3 = data2 && data2.map((dt) => dt.type);

  const currentData = data && data[size - 1] ? data[size - 1].channels : [];
  const totalChannels = data ? data[0]?.total || 0 : 0;
  const totalPages = Math.ceil(totalChannels / PAGE_LIMIT);

  const rows = currentData.map((item) => (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Group wrap="nowrap" justify="start" gap={12}>
            <AspectRatio
                className="border border-red-500"
                ratio={55 / 40}
                maw={50}
                my={4}
            >
              <Image src={item.logo} />
            </AspectRatio>
            <Text size="sm">{item.name}</Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text>Categories Placeholder</Text>
        </Table.Td>
        <Table.Td>
          <Group wrap="nowrap">
            <ActionIcon variant="transparent">
              <IconEdit color="#3F56AC" stroke={2} />
            </ActionIcon>
            <ActionIcon
                onClick={() => {
                  setChannelToDelete(item);
                  setDeleteDialogOpened(true);
                }}
                variant="transparent"
            >
              <IconTrash color="red" stroke={2} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
  ));

  const handlePageChange = async (page: number) => {
    setIsPageLoading(true);
    await setSize(page);
    setIsPageLoading(false);
  };

  const asside: ReactNode = (
      <Container w="90%">
        <Stack>
          <CloseButton onClick={() => toggle()} />
          <Title>Add channel</Title>

          <TextInput
              label="Channel Name"
              onChange={(e) => setName(e.target.value)}
          />
          <Box>
            <Text size="sm" weight={500} mb={4}>
              Channel Logo
            </Text>
            <Box bg="white" w={280} h={150}>
              <Dropzone
                  onDrop={(files) => setInput(URL.createObjectURL(files[0]))}
                  accept="image/*"
              >
                <Flex direction="column" align="center" justify="center" h="100%">
                  <IconUpload size={100} color="gray" />
                  <Text>Add Logo</Text>
                </Flex>
              </Dropzone>
            </Box>
          </Box>
          <TextInput
              leftSection={<IconLink size={18} />}
              label="Channel url"
              onChange={(event) => setInput(event.target.value)}
          />
          <Group justify="flex-end" mt="md">
            <Button
                loading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  addChannel({
                    name: name,
                    country: country,
                    input: input,
                    logo: logo,
                    category: category,
                  }).then((r) => {
                    setIsLoading(false);
                    setCategory([]);
                    setLogo("");
                    setInput("");
                    setName("");
                    setCountry("");
                    toggle();
                  });
                }}
            >
              Submit
            </Button>
          </Group>
        </Stack>
      </Container>
  );

  return (
      <AppShellComponent title="Channels" aside={value ? asside : null}>
        <DataTable
            head={head}
            btnTitle={"Add Channels"}
            searchPlaceholder="Search channels"
            rows={rows}
            onClick={() => toggle()}
            currentPage={size}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={isPageLoading}
        />
        <Dialog
            opened={deleteDialogOpened}
            onClose={() => setDeleteDialogOpened(false)}
            onConfirm={deleteChannel}
            message={`Are you sure you want to delete this channel?`}
        />
        <DoneDialog
            opened={showDoneDialog}
            onClose={() => setShowDoneDialog(false)}
        />
      </AppShellComponent>
  );
};

export default Channels;
