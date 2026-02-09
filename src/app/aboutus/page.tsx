"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="flex flex-col items-center w-full bg-slate-900">
      {/* Header Section */}
      <section className="w-full bg-slate-900 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-screen-xl mx-auto px-6 flex flex-col gap-20 text-center"
        >
          <h1 className="font-mono text-4xl md:text-6xl font-bold text-blue-400">
            About HoCoHOC
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-2xl mx-auto">
            Student-led, HCPSS approved, and passionate about technology
            education
          </p>
        </motion.div>
      </section>

      <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-lg my-12"></div>

      {/* Mission Section */}
      <section className="w-full bg-slate-900 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-screen-xl mx-auto px-6"
        >
          <div className="mb-16">
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-blue-400 mb-6">
              Who We Are
            </h2>
            <p className="text-slate-300 text-lg md:text-lg leading-relaxed max-w-3xl">
              We are a student-led group that is HCPSS approved focused on
              teaching students about the world of technology during the Hour of
              Code week each December.
            </p>
          </div>

          {/* What We Do */}
          <div className="mb-16">
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-blue-400 mb-6">
              What We Do
            </h2>
            <div className="text-slate-300 text-lg md:text-lg leading-relaxed space-y-4 max-w-3xl">
              <p>
                Students can gain points for their school by completing the
                different articles and quizzes, written by students. Throughout
                the website there&apos;ll be small easter eggs, collecting all
                of these will result in double the points for each level.
              </p>
              <p>
                The students that gain the most points will earn certain prizes
                such as iPads, headphones, or giftcards. Additionally, the
                winning school will gain a trophy for scoring the most points
                during the event.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-blue-400 mb-6">
              Student Commitments
            </h2>
            <p className="text-slate-300 text-lg md:text-lg leading-relaxed mb-8 max-w-3xl">
              Since we are a student-led group, responsibility and
              accountability are our first priorities. Any role that you decide
              to take on, you&apos;ll be briefed on the necessary actions
              you&apos;ll need to take to have a successful year with HoCoHOC.
            </p>
          </div>

          {/* Roles Grid */}
          <div>
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-blue-400 mb-8">
              Our Roles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-500 transition-colors"
              >
                <h3 className="font-mono text-xl font-bold text-blue-400 mb-3">
                  Article Writers
                </h3>
                <p className="text-slate-300">
                  Typically responsible for writing the articles seen on the
                  site.
                </p>
              </motion.div>

              {/* Role 2 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-500 transition-colors"
              >
                <h3 className="font-mono text-xl font-bold text-blue-400 mb-3">
                  Article Lead
                </h3>
                <p className="text-slate-300">
                  Responsible for oversight of all the Article Writers, may need
                  to write some themselves.
                </p>
              </motion.div>

              {/* Role 3 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-500 transition-colors"
              >
                <h3 className="font-mono text-xl font-bold text-blue-400 mb-3">
                  Marketer
                </h3>
                <p className="text-slate-300">
                  Reaches out to certain sponsors and tries to gain
                  sponsorships.
                </p>
              </motion.div>

              {/* Role 4 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-500 transition-colors"
              >
                <h3 className="font-mono text-xl font-bold text-blue-400 mb-3">
                  Web Developer
                </h3>
                <p className="text-slate-300">
                  All coding required and bugs that pop up for the site should
                  be covered by these coders.
                </p>
              </motion.div>

              {/* Role 5 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-500 transition-colors"
              >
                <h3 className="font-mono text-xl font-bold text-blue-400 mb-3">
                  Social Media Manager
                </h3>
                <p className="text-slate-300">
                  Manages all social media accounts such as the Discord server
                  and Instagram account.
                </p>
              </motion.div>

              {/* Role 6 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-sky-500 transition-colors"
              >
                <h3 className="font-mono text-xl font-bold text-blue-400 mb-3">
                  Outreach
                </h3>
                <p className="text-slate-300">
                  Responsible for creating new roles and recruiting new
                  associates.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-lg my-12"></div>

      {/* CTA Section */}
      <section className="w-full bg-slate-900 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-screen-xl mx-auto px-6 flex flex-col gap-6 text-center"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-blue-400">
            Ready to Join Us?
          </h2>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
            Interested in helping organize Howard County&apos;s Hour of Code?
            Apply to be part of our amazing team!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/recruitment"
              className="btn-primary px-8 py-3 text-base font-semibold"
            >
              Join Our Team
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
