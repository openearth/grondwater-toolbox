export const mapContentToProps = content => {
  switch (content.type) {
    case 'Collapse':
      return {
        title: content.text,
        content: content.content,
      };
    case 'Container':
      return {
        content,
      };
    default:
      return {};
  }
};
