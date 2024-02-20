import { DollarInput, useDollarInput } from "@/components/dollar-input";
import { Heading } from "@/components/heading";
import { useEffect, useState, useMemo } from "react";

export const getServerSideProps = async () => {
  return {
    props: {
      hideSidebar: false,
    },
  };
};

export default function Page() {
  const { amountInCents, ...inputProps } = useDollarInput();
  return (
    <div>
      <Heading variant="h1"> Playground</Heading>

      <div className="w-56 bg-slate-400">
        <DollarInput {...inputProps} maxValue={5} stepInCents={33} />
      </div>
    </div>
  );
}
