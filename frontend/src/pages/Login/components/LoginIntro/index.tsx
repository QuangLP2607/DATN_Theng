import classNames from "classnames/bind";

import Icon from "@/components/Icon";
import LogoIcon from "@/assets/logo_icon1.svg";
import LogoText from "@/assets/logo_text.svg";

import styles from "./LoginIntro.module.scss";

const cx = classNames.bind(styles);

const features = [
  {
    icon: "meteor-icons:books",
    title: "Nội dung",
    description: "Học liệu tập trung",
  },
  {
    icon: "reicon:chart",
    title: "Tiến độ",
    description: "Theo dõi rõ ràng",
  },
  {
    icon: "simple-line-icons:check",
    title: "Bảo mật",
    description: "Truy cập theo vai trò",
  },
];

export default function LoginIntro() {
  return (
    <section className={cx("login-intro")}>
      <div className={cx("login-intro__brand")}>
        <img
          className={cx("login-intro__brand-icon")}
          src={LogoIcon}
          alt=""
          draggable={false}
        />

        <img
          className={cx("login-intro__brand-text")}
          src={LogoText}
          alt="EduLearning"
          draggable={false}
        />
      </div>

      <div className={cx("login-intro__content")}>
        <h2 className={cx("login-intro__title")}>
          Một tài khoản,
          <br />
          trọn hành trình học tập
        </h2>

        <p className={cx("login-intro__description")}>
          Kết nối học sinh, giáo viên và nhà trường trên một không gian học tập
          an toàn, xuyên suốt.
        </p>
      </div>

      <div className={cx("login-intro__features")}>
        {features.map((feature) => (
          <div className={cx("login-intro__feature-item")} key={feature.title}>
            <div className={cx("login-intro__feature-icon")}>
              <Icon name={feature.icon} />
            </div>

            <h3 className={cx("login-intro__feature-title")}>
              {feature.title}
            </h3>

            <p className={cx("login-intro__feature-description")}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
