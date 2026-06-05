import connectDB from '@/lib/db/mongodb';
import Host from '@/models/Host.model';
import { hashPassword } from '@/lib/utils/hash';
import type { IHost, CreateHostInput } from '@/types/host.types';

export async function createHost(data: CreateHostInput): Promise<IHost> {
  await connectDB();

  const email = data.email.toLowerCase().trim();

  const existing = await Host.findOne({ email });
  if (existing) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  const host = await Host.create({
    name: data.name.trim(),
    email,
    password: hashedPassword,
  });

  // Explicitly construct return shape — password is never included
  const result: IHost = {
    _id: (host._id as { toString(): string }).toString(),
    name: host.name,
    email: host.email,
    createdAt: host.createdAt,
  };

  return result;
}

export async function findHostByEmail(email: string) {
  await connectDB();
  return Host.findOne({ email: email.toLowerCase().trim() }).select('+password');
}
