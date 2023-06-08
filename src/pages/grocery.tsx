import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, useReducer, useState, SetStateAction } from "react";
import useSWR, { useSWRConfig } from "swr";
import { GetServerSideProps } from "next";
import { withAuthServerSideProps } from "lib/auth";
import { Skeleton, Tab, Tabs } from '@mui/material';
import { TabPanel } from "@mui/lab";
import { ItemDialog } from "components/organisms/ItemDialog";
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import Layout from 'components/templates/Layout'
import Text from 'components/atoms/Text'
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie"


const getCookie = () => {
  if (typeof document !== 'undefined') {
    //クッキーに値をセット
    console.log(document.cookie);
    const arr: {[key: string]: string} = {};
    if (document.cookie) return undefined;
    if(document.cookie != ''){
      var tmp = document.cookie.split('; ');
      for(var i=0;i<tmp.length;i++){
        var data = tmp[i].split('=');
        arr[data[0]] = decodeURIComponent(data[1]);
      }
    
    const uid: string = arr['uid'];
    const client: string = arr['client'];
    const accessToken: string = arr['access-token'];
    console.log("============checkCookie============");
    console.log(client);
    console.log(uid);
    console.log(accessToken);
    return {uid, client, accessToken};
    }
  }
}

// const fetcher = (url: string) => {
//   const cookieData = getCookie();
//   console.log(cookieData);
//   console.log(url);
//   fetch(url).then((res) => res.json())
// };

const fetcher = (url: string, uid: string, client: string, accessToken: string) => fetch(url, {
  credentials: 'include',
  headers: {
    "Content-Type": "application/json",
    // "uid": uid,
    // "client": client,
    // "access-token": accessToken,
  },
}).then((res) => res.json());

// const fetcher = (url: string) => {
//   const cookieData = getCookie();
//   const uid = cookieData?.uid;
//   const client = cookieData?.client;
//   const accessToken = cookieData?.accessToken;
//   console.log("===========fetcher============");
//   console.log(client);
//   console.log(uid);
//   console.log(accessToken);
//   fetch(url, {
//   credentials: 'include',
//   headers: {
//     "Content-Type": "application/json",
//     "uid": uid,
//     "client": client,
//     "access-token": accessToken,
//   },
// })}.then((res) => res.json());

// export const getServerSideProps: GetServerSideProps =
//   withAuthServerSideProps("groceries");



const Grocery: NextPage = () => {
  
  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // checkCookie();
  const [text, setText] = useState('');
  const { data, error } = useSWR(
    "http://localhost:3010/api/v1/groceries",
    fetcher
  );

  console.log(data);
  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;

  // console.log(data);

  // const { mutate } = useSWRConfig()

  // const onSubmitHandler = (event: { preventDefault: () => void; }) => {
  //   event.preventDefault();
  //   console.log(text);
  // };


  const changeText = (e: any) => {
    setText(e.target.value);
    clickSubmit(e.target.value);
  }

  const clickSubmit = (e: any) => {
    console.log("送信されました");
    console.log(text);
    const axiosInstance = axios.create({
      baseURL: `http://localhost:3010/api/v1/`,
      headers: {
        "content-type": "application/json",
      },
    });
    (async () => {
      setIsError(false);
      setErrorMessage("");
      return await axiosInstance
        .post("searches", {
          data: text,
        })
        .then(function (response) {
          // Cookieにトークンをセットしています
          console.log(response.headers);
          console.log(response);
          Cookies.set("uid", response.headers["uid"]);
          Cookies.set("client", response.headers["client"]);
          Cookies.set("access-token", response.headers["access-token"]);
        })
        .catch(function (error) {
          // Cookieからトークンを削除しています
          setIsError(true);
          setErrorMessage(error.response.data.errors[0]);
        });
    })();
  }
  
  return (
    <Layout {...data}>
      <Flex padding={2} justifyContent="center" backgroundColor="grayBack">
        <Flex
          width={{ base: '100%', md: '1040px' }}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Box width="100%">
            <Box width="100%">
              <Link href="/grocery">
                <Text>食料品</Text>
              </Link>
              <Link href="/product">
                <Text>日用品</Text>
              </Link>
            </Box>
            <Box width="100%">
              <Text>検索</Text>
              
              <form method="POST">
              {/* テキスト入力フォーム */}
              <input 
                className="border border-black" 
                type="text" 
                value={text}
                onChange={changeText}
              />
              {/* 追加ボタン */}
              <input
                type="submit"
                value="検索"
                onClick={clickSubmit}
              />
            </form>

            </Box>
            <div >
              {data.data.map((grocery: any) => (
                <li className='p-4' key={grocery.id}>
                  <p>ID: {grocery.id}</p>
                  <p>Created at: {grocery.created_at}</p>
                  <p>Updated at: {grocery.updated_at}</p>
                  <p>Category Grocery ID: {grocery.category_grocery_id}</p>
                  <p>Sub Category Grocery ID: {grocery.sub_category_grocery_id}</p>
                  <p>Item ID: {grocery.item_id}</p>
                  <Link href={`http://localhost:3000/grocery/${grocery.id}`}>Show</Link>
                </li>
              ))}
            </div>
          </Box>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default Grocery;