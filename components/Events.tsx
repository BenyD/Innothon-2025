<section id="events" className="py-8 sm:py-16 px-4">
  <div className="max-w-7xl mx-auto">
    {/* ... SectionTitle remains same ... */}

    {/* Adjusted grid spacing for mobile */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-8">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-25px" }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="group touch-manipulation"
        >
          {/* ... Event card content with adjusted spacing ... */}
        </motion.div>
      ))}
    </div>
  </div>
</section> 