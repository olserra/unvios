import Link from "next/link";

export default function SecurityPage() {
  return (
    <main className="bg-white">
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Security & Privacy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trust is our top priority. Below we explain how we protect your
            data, the controls you have, and the security practices we follow to
            keep everything safe.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Encryption in transit and at rest
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We protect data in transit using modern TLS (1.2/1.3) and encrypt
              sensitive data at rest where applicable. Keys are managed using
              industry best practices and rotated regularly to reduce exposure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Access control & least privilege
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Access to production data is limited by the principle of least
              privilege. Strong authentication, role-based access controls, and
              audit logs are used to track and review access. Administrative
              actions are logged and periodically reviewed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Data export and deletion
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You control your information. At any time you can export your data
              (JSON/CSV/PDF) or request complete account and data deletion.
              Export tools are available in the user dashboard, or you can
              contact support for assistance.
            </p>
            <ul className="list-disc list-inside mt-3 text-gray-600">
              <li>
                Export: full download of your memories in JSON/CSV formats.
              </li>
              <li>
                Delete: permanent removal of all data associated with your
                account.
              </li>
              <li>
                Retention: backup copies are removed within documented retention
                windows after deletion, except where legal obligations apply.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Privacy by design
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We design systems to collect the minimum data required and to give
              users control over what is stored. We do not sell your personal
              data. Third-party providers are used only when necessary and are
              bound by strict data processing agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Operational practices & compliance
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our security program follows industry-standard controls, including
              vulnerability management, code reviews, and regular penetration
              testing. Where applicable, we pursue compliance with relevant
              regulations (e.g., GDPR) and maintain internal policies for data
              protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Monitoring & incident response
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We run continuous monitoring to detect anomalous activity and
              maintain an incident response plan that covers investigation,
              mitigation, and communication. If an incident affects your data,
              we will notify you in accordance with legal and best practice
              requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Data governance
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Teams regularly review retention, access, and data minimization
              practices. Dependencies and libraries are kept up to date, and
              engineering, product, and compliance collaborate to maintain a
              high security standard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              How to request export or deletion
            </h2>
            <ol className="list-decimal list-inside mt-3 text-gray-600">
              <li>
                Open your account dashboard at{" "}
                <Link
                  href="/dashboard/memories"
                  className="text-orange-600 underline"
                >
                  Dashboard
                </Link>{" "}
                and use the export/delete options.
              </li>
              <li>
                If you prefer, email support with the subject "Export/Delete
                request" and we will guide you through the process.
              </li>
              <li>
                You will receive confirmation by email once the request is
                completed.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <strong>Do you share data with advertisers?</strong>
                <div>
                  No — we do not sell or share your personal data for
                  advertising purposes.
                </div>
              </div>
              <div>
                <strong>
                  Can I use the account without enabling integrations?
                </strong>
                <div>
                  Yes — integrations are optional and you can revoke permissions
                  at any time.
                </div>
              </div>
              <div>
                <strong>How are backups handled?</strong>
                <div>
                  Backups are encrypted and retained for limited periods; after
                  account deletion we remove backups within documented
                  timeframes.
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6">
            <p className="text-sm text-gray-500">
              For more technical details or to report a security concern,
              contact our security team at{" "}
              <a
                href="mailto:security@memora.example"
                className="text-orange-600 underline"
              >
                security@memora.example
              </a>
              .
            </p>
          </section>

          <div className="pt-8 text-center">
            <Link href="/privacy" className="text-orange-600 underline">
              Read our Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
