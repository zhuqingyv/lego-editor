import { useSignal } from 'react-use-signal';

const AddComponentButton = () => {
  const [isDev] = useSignal('app', 'isDev');

  if (!isDev) return null;
  return (
    <div className="header-save-button-container">新增组件</div>
  )
};

export default AddComponentButton;