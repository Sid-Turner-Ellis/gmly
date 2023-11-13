import { Heading } from "@/components/heading";
import Switch from "@/components/switch";
import { Text } from "@/components/text";
import { tailwind } from "@/lib/tailwind";
import { useEffect, useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfilesService } from "@/features/profile/profiles-service";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { produce } from "immer";
import { useToast } from "@/providers/toast-provider";

/**
 * Title goes in a page layout componnet
 * NOTE - We need to be updating the user cache whenever we change something relating to the profile
 *  - Maybe via the profile service - useProfile hook maybe
 */

export default function Page() {
  return <></>;
}
