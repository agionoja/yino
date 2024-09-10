import { ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { Button } from "~/components/button";

export async function action({ request }: ActionFunctionArgs) {
  return null;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Verify Account" },
    { name: "description", content: "Verify your yino account" },
  ];
};

export default function RouteComponent() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form>
        <Button className={"bg-blue"} disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify account"}
        </Button>
      </Form>
    </>
  );
}
