import mongoose, { Schema , Document } from 'mongoose';
import bcrypt from 'bcrypt'

interface IUser extends Document {
    email: string;
    password: string; 
    role: string; 
    resetPasswordToken?: string; 
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date; 
    comparePassword(userPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema (
    {
        email: { type:String, required:true, unique:true , lowercase:true, trim:true },
        password: { type: String , required:true},
        role: { type: String, default:'user'}, 
        resetPasswordToken: { type: String},
        resetPasswordExpires:{type: Date},
    },
    {
        timestamps: true, 
    }
); 


// Middleware to hash password 
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) 
        return next()
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next()
    }catch (error) {
        if(error instanceof Error) {
        next(error)
        }
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (this: IUser, userPassword: string): Promise<boolean> {
    if (!this.password) {
      throw new Error('Password is not set.');
    }
    return bcrypt.compare(userPassword, this.password);
  };


const User = mongoose.model<IUser>('User', UserSchema);

export default User; 

