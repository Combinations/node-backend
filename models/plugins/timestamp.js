/* Plugin that adds updatedAt and createdAt fields to models
 *
 * ie. If I want to set updatedAt and createdAt fields on the User model, in the user schema I will add the following:
 *
 * userSchema.plugin(timestampPlugin)
 * 
 * */
module.exports = function timestamp(schema) {

  // Add the two fields to the schema
  schema.add({ 
    createdAt: Date,
    updatedAt: Date
  })

  // Create a pre-save hook
  schema.pre('save', function (next) {
    let now = Date.now()

    this.updatedAt = now

    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
      this.createdAt = now
    }

   // Call the next function in the pre-save chain
   next()    
  })
}

