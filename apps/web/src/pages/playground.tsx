import { useEffect, useState, useMemo } from "react";

export const getServerSideProps = async () => {
  return {
    props: {
      hideSidebar: false,
    },
  };
};

export default function Page() {
  return <div className="w-32">Playground</div>;
}
