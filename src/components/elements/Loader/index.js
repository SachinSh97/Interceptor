import settingIcon from '../../../assets/Icons/setting.svg';
import './Loader.scss';

const Loading = () => {
  return (
    <div className="loader">
      <div className="icon">
        <img className="icon_left" src={settingIcon} alt="setting" />
        <img className="icon_right" src={settingIcon} alt="setting" />
      </div>
      <div className="overlay" />
    </div>
  );
};

export default Loading;
