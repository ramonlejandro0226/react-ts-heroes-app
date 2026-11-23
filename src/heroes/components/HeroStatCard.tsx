import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PropsWithChildren } from "react";

import type { JSX } from "react/jsx-runtime";



interface Props extends PropsWithChildren{
    title:string;
    icon:JSX.Element;
    // children: React.ReactNode --> se puede hacer asi o tambien extender  de PropsWithChildren para usar los children 
}

export const HeroStatCard = ({title,icon,children}:Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
         {icon}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
