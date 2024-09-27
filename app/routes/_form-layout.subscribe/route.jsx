import { Form } from "@remix-run/react";

export default function Subscribe() {
  return (
    <>
      <Form>
        <label>
          <span>Name</span>
          <input type="text" placeholder="enter your name" />
        </label>

        <button>Subscribe</button>
      </Form>
    </>
  );
}
