export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-wrapper">
          <div className="footer-links-wrapper">
            <a href="#" link-type="page" className="footer-link">
              Privacy Policy
            </a>
            <a href="#" link-type="page" className="footer-link">
              Terms of Use
            </a>
          </div>
          <div className="socilal-wrapper">
            <a
              href="https://t.me/campfireinvest"
              target="_BLANK"
              link-type="url"
            >
              <img
                src="/assets/fe50d43b054eda23cb54d4c2f14d0ccf_691.svg"
                loading="lazy"
                alt="null"
                className="social-iocn"
              />
            </a>
            <a
              href="https://x.com/campfireinvest"
              target="_BLANK"
              link-type="url"
            >
              <img
                src="/assets/cdfee661c5701fe8c728d22cbb1c5588_344.svg"
                loading="lazy"
                alt="null"
                className="social-iocn"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/campfire-invest"
              target="_BLANK"
              link-type="url"
            >
              <img
                src="/assets/d6dc90a3879e7b733ae5dd08b14aade8_874.svg"
                loading="lazy"
                alt="null"
                className="social-iocn"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
