import type { NextPage } from "next";
import Link from "next/link";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Product: NextPage = () => {
  const { data, error } = useSWR(
    "http://52.195.64.253:3010/api/v1/shops",
    fetcher
  );

  if (error) return <div>An error has occurred.</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);

  return (
    <div >
      {data.data.map((shop: any, index: number) => (
        <li className='p-4' key={shop.id}>
          <p>ID: {shop.id}</p>
          <p>Created at: {shop.created_at}</p>
          <p>Updated at: {shop.updated_at}</p>
          <p>Name: {shop.name}</p>
          <Link href={`http://localhost:3000/shop/${shop.id}`}>Show</Link>
        </li>
      ))}
    </div>
  );
};

export default Product;