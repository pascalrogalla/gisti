require "language/node"

class Gisti < Formula
  desc "CLI for gist"
  homepage "https://github.com/pascalrogalla/gisti"
  url "https://github.com/pascalrogalla/gisti/archive/v0.0.1.tar.gz"
  sha256 "d8846cf42371ebe20b8e94557a1c80ffcbd539c91631be96d7c04453d99d8ac0"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    # assert_equal version.to_s, shell_output("#{bin}/gisti -v").chomp
    raise "Test not implemented."
  end
end
