import { stringify } from 'query-string';

export default function({
  url,
  service,
  request,
  encode = true,
  width = 256,
  height = 256,
  ...rest
}) {
  if (!request) {
    return undefined;
  }

  const params = stringify({
    service,
    request,
    ...(width && { width: width }),
    ...(height && { height: height }),
    ...rest,
  }, { encode, sort: false });

  return `${ url }?${ params }`;
}
