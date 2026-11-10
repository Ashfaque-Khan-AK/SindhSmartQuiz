import { ICON_MAP } from '../../utils/helpers';

export default function DynamicIcon({ name, ...props }) {
  const Component = ICON_MAP[name] || ICON_MAP.Award;
  return <Component {...props} />;
}
