import {ReactNode} from "react";
import Head from "next/head";
import {Container} from "@chakra-ui/react";
import Header from "./Header";

type PageProps = {
    children: ReactNode;
    title?: string;
}

const Layout = ({children, title}: PageProps) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" type="image/png" href="/icon.png"/>

            </Head>
            {/*<Header/>*/}
            <Container maxW={'7xl'}>
                {children}
            </Container>
        </>
    );
};
export default Layout;