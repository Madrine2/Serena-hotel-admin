import "../../hotel-admin/styles/globals.css";
import "@mantine/core/styles.css";

import type { AppProps } from "next/app";
import {
  Button,
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import { SWRConfig } from "swr";
import axios from "axios";

const blue: MantineColorsTuple = [
  "#ebf1ff",
  "#d3dffa",
  "#a1bcf7",
  "#6d97f6",
  "#4678f5",
  "#3165f6",
  "#275bf7",
  "#1d4cdc",
  "#1442c5",
  "#0039ad",
];
const brown: MantineColorsTuple = [
  "#fff1e5",
  "#fce3d2",
  "#f2c5a8",
  "#e9a77a",
  "#e18c53",
  "#dd7b3a",
  "#dc732c",
  "#c2611f",
  "#ae5518",
  "#99480f",
];

const theme = createTheme({
  colors: {
    blue: blue,
    brown: brown,
  },
  defaultGradient: {
    from: "blue",
    to: "brown",
    deg: 90,
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        color: "blue",
        variant: "outline",
      },
    }),
  },
  // focusRing: "always",
  primaryColor: "blue",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        provider: () => new Map(),
        fetcher: (url: string) => axios.get(url).then((res) => res.data),
      }}
    >
      <MantineProvider theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </SWRConfig>
  );
}
