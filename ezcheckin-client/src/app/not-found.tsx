import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4">
      <div className="glass-card-hover p-10 text-center max-w-lg w-full">
        
        {/* 404 */}
        <h1 className="text-7xl font-bold glow-text mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Trang bạn đang tìm không tồn tại hoặc đã bị xóa.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="glow-button inline-block"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}