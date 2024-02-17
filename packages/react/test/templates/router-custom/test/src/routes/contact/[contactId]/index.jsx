import {React} from '@flecks/react';
import {useParams} from '@flecks/react/router';

export function Component() {
  const params = useParams();
  return (
    <div className="test-contact">
      {params.contactId}
    </div>
  );
}
