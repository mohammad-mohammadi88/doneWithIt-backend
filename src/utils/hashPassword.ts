import bcrypt from "bcrypt";

const handPassword = async (password: string) =>
    await bcrypt.hash(password, 10);

const isPasswordValid = async (normalPassword: string, hashedPassword: string) =>
    await bcrypt.compare(normalPassword, hashedPassword);

const generatePassword = {
    handPassword,
    isPasswordValid,
};
export default generatePassword;
