import { useLocation } from 'react-router-dom';

import PlaceholderPage from './PlaceholderPage';

const ProductsPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const keyword = params.get('keyword');

  return (
    <PlaceholderPage
      title="Products"
      subtitle={keyword ? `Search keyword: ${keyword}` : 'No search keyword'}
    />
  );
};

export default ProductsPage;
