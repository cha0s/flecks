import {React} from '@flecks/react';
import {
  Form,
  useLoaderData,
  redirect,
} from '@flecks/react/router';

export function Component() {
  const {contact} = useLoaderData();
  return (
    <Form method="post" id="test-contact-form">
      <input
        aria-label="Contact ID"
        type="text"
        name="id"
        defaultValue={contact}
      />
      <button type="submit">Submit</button>
    </Form>
  );
}

export async function action({request}) {
  const formData = await request.formData();
  return redirect(`/contact/${formData.get('id')}`);
}

export async function loader({params}) {
  return {contact: params.contactId};
}
